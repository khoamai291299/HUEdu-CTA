package com.hueductatemp

import android.media.MediaPlayer
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Module phát audio cục bộ (file://...) — sử dụng lại 1 instance MediaPlayer
 * để audio hardware luôn "ấm", tránh mất chữ đầu (AudioTrack cold-start latency).
 */
class SimpleAudioPlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null
    private var pendingPlayPromise: Promise? = null
    private var isWarmedUp = false
    private var keepAliveMp: MediaPlayer? = null

    override fun getName(): String = "SimpleAudioPlayer"

    /**
     * Warm-up: phát file ngay khi app init để AudioTrack không bị cold-start lần đầu.
     * Gọi 1 lần duy nhất từ JS khi app khởi động xong.
     */
    @ReactMethod
    fun warmup(promise: Promise) {
        if (isWarmedUp) {
            promise.resolve(null)
            return
        }
        Thread {
            try {
                // Dùng kỹ thuật "Keep-Alive": Phát một file câm lặp lại vô tận
                // để giữ Audio hardware luôn thức, loại bỏ hoàn toàn độ trễ khởi động
                val keepMp = MediaPlayer()
                keepMp.setDataSource(getOrCreateSilenceFile())
                keepMp.prepare()
                keepMp.isLooping = true
                keepMp.start()
                keepAliveMp = keepMp
                isWarmedUp = true
                Log.d("SimpleAudioPlayer", "Audio hardware warmed up & kept alive")
            } catch (_: Exception) {}
            promise.resolve(null)
        }.start()
    }

    private fun getOrCreateSilenceFile(): String {
        val cacheDir = reactApplicationContext.cacheDir
        val silenceFile = java.io.File(cacheDir, "silence_keepalive.wav")
        if (!silenceFile.exists()) {
            try {
                val sampleRate = 44100
                val durationMs = 1000
                val numSamples = (durationMs * sampleRate) / 1000
                val header = ByteArray(44)
                val totalDataLen = numSamples * 2
                val totalAudioLen = totalDataLen + 36
                
                header[0] = 'R'.code.toByte(); header[1] = 'I'.code.toByte(); header[2] = 'F'.code.toByte(); header[3] = 'F'.code.toByte()
                header[4] = (totalAudioLen and 0xff).toByte(); header[5] = ((totalAudioLen shr 8) and 0xff).toByte(); header[6] = ((totalAudioLen shr 16) and 0xff).toByte(); header[7] = ((totalAudioLen shr 24) and 0xff).toByte()
                header[8] = 'W'.code.toByte(); header[9] = 'A'.code.toByte(); header[10] = 'V'.code.toByte(); header[11] = 'E'.code.toByte()
                header[12] = 'f'.code.toByte(); header[13] = 'm'.code.toByte(); header[14] = 't'.code.toByte(); header[15] = ' '.code.toByte()
                header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0
                header[20] = 1; header[21] = 0
                header[22] = 1; header[23] = 0
                header[24] = (sampleRate and 0xff).toByte(); header[25] = ((sampleRate shr 8) and 0xff).toByte(); header[26] = ((sampleRate shr 16) and 0xff).toByte(); header[27] = ((sampleRate shr 24) and 0xff).toByte()
                val byteRate = sampleRate * 2
                header[28] = (byteRate and 0xff).toByte(); header[29] = ((byteRate shr 8) and 0xff).toByte(); header[30] = ((byteRate shr 16) and 0xff).toByte(); header[31] = ((byteRate shr 24) and 0xff).toByte()
                header[32] = 2; header[33] = 0
                header[34] = 16; header[35] = 0
                header[36] = 'd'.code.toByte(); header[37] = 'a'.code.toByte(); header[38] = 't'.code.toByte(); header[39] = 'a'.code.toByte()
                header[40] = (totalDataLen and 0xff).toByte(); header[41] = ((totalDataLen shr 8) and 0xff).toByte(); header[42] = ((totalDataLen shr 16) and 0xff).toByte(); header[43] = ((totalDataLen shr 24) and 0xff).toByte()
                
                val fos = java.io.FileOutputStream(silenceFile)
                fos.write(header)
                fos.write(ByteArray(totalDataLen))
                fos.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return silenceFile.absolutePath
    }

    @ReactMethod
    fun play(path: String, promise: Promise) {
        stopInternal()
        pendingPlayPromise = promise
        Thread {
            try {
                val realMp = MediaPlayer()
                realMp.setDataSource(path)
                realMp.prepare()
                
                mediaPlayer = realMp

                realMp.setOnCompletionListener {
                    it.release()
                    if (mediaPlayer === it) {
                        pendingPlayPromise?.resolve(null)
                        pendingPlayPromise = null
                        mediaPlayer = null
                    }
                }
                realMp.setOnErrorListener { it, _, _ ->
                    it.release()
                    if (mediaPlayer === it) {
                        pendingPlayPromise?.reject("PLAYBACK_ERROR", "Error playing audio")
                        pendingPlayPromise = null
                        mediaPlayer = null
                    }
                    true
                }

                realMp.start()

            } catch (e: Exception) {
                pendingPlayPromise?.reject("PLAY_ERROR", e.message ?: "Unknown")
                pendingPlayPromise = null
            }
        }.start()
    }

    @ReactMethod
    fun stop(promise: Promise) {
        stopInternal()
        promise.resolve(null)
    }

    private fun stopInternal() {
        val mp = mediaPlayer ?: return
        mediaPlayer = null
        try { mp.stop() } catch (_: Exception) {}
        try { mp.release() } catch (_: Exception) {}
        pendingPlayPromise?.resolve(null)
        pendingPlayPromise = null
    }
}