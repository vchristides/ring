import {
  MediaStreamTrack,
  RTCIceCandidate,
  RTCPeerConnection,
  RtcpPacket,
  RTCRtpCodecParameters,
  RtpPacket,
} from '@koush/werift'
import { Subject } from 'rxjs'
import { logError, logInfo } from './util'

const debug = true

export class PeerConnection {
  pc
  onAudioRtp = new Subject<RtpPacket>()
  onAudioRtcp = new Subject<RtcpPacket>()
  onVideoRtp = new Subject<RtpPacket>()
  onVideoRtcp = new Subject<RtcpPacket>()
  onIceCandidate = new Subject<RTCIceCandidate>()
  returnAudioTrack = new MediaStreamTrack({ kind: 'audio' })

  constructor() {
    const pc = (this.pc = new RTCPeerConnection({
        codecs: {
          audio: [
            new RTCRtpCodecParameters({
              mimeType: 'audio/opus',
              clockRate: 48000,
              channels: 2,
            }),
          ],
          video: [
            new RTCRtpCodecParameters({
              mimeType: 'video/H264',
              clockRate: 90000,
              rtcpFeedback: [
                { type: 'transport-cc' },
                { type: 'ccm', parameter: 'fir' },
                { type: 'nack' },
                { type: 'nack', parameter: 'pli' },
                { type: 'goog-remb' },
              ],
              parameters:
                'level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f',
            }),
          ],
        },
      })),
      audioTransceiver = pc.addTransceiver(this.returnAudioTrack, {
        direction: 'sendrecv',
      }),
      videoTransceiver = pc.addTransceiver('video', {
        direction: 'recvonly',
      })

    audioTransceiver.onTrack.subscribe((track) => {
      let lastTimeStamp = 0
      track.onReceiveRtp.subscribe((rtp) => {
        lastTimeStamp = rtp.header.timestamp
        this.onAudioRtp.next(rtp)
      })

      track.onReceiveRtcp.subscribe((rtcp) => {
        this.onAudioRtcp.next(rtcp)
      })

      if (debug) {
        track.onReceiveRtp.once(() => {
          logInfo('received first audio packet')
        })
      }
    })

    videoTransceiver.onTrack.subscribe((track) => {
      track.onReceiveRtp.subscribe((rtp) => {
        this.onVideoRtp.next(rtp)
      })

      track.onReceiveRtcp.subscribe((rtcp) => {
        this.onVideoRtcp.next(rtcp)
      })

      track.onReceiveRtp.once(() => {
        if (debug) {
          logInfo('received first video packet')
        }

        setInterval(
          () => videoTransceiver.receiver.sendRtcpPLI(track.ssrc!),
          2000
        )
      })
    })
    this.pc.onIceCandidate.subscribe((iceCandidate) => {
      this.onIceCandidate.next(iceCandidate)
    })

    pc.iceConnectionStateChange.subscribe(() => {
      console.log(
        'iceConnectionStateChange',
        pc.connectionState,
        pc.iceConnectionState
      )
    })
    pc.connectionStateChange.subscribe(() => {
      console.log(
        'connectionStateChange',
        pc.connectionState,
        pc.iceConnectionState
      )
    })
  }

  async createOffer() {
    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)

    return offer
  }

  async createAnswer(offer: { type: 'offer'; sdp: string }) {
    await this.pc.setRemoteDescription(offer)
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)

    return answer
  }

  async acceptAnswer(answer: { type: 'answer'; sdp: string }) {
    await this.pc.setRemoteDescription(answer)
  }

  addIceCandidate(candidate: RTCIceCandidate) {
    console.log(
      'Got ice candidate',
      candidate.sdpMLineIndex === 0 ? 'audio' : 'video',
      candidate.candidate
    )
    return this.pc.addIceCandidate(candidate)
  }

  close() {
    this.pc.close().catch(logError)
  }
}
