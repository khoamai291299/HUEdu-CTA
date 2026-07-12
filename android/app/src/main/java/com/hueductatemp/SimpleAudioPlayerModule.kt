package com.hueductatemp

import android.media.MediaPlayer
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SimpleAudioPlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null
    /** Promise của lần play đang chờ — được resolve khi audio hoàn thành hoặc bị stop. */
    private var pendingPlayPromise: Promise? = null

    override fun getName(): String = "SimpleAudioPlayer"

    @ReactMethod
    fun play(path: String, promise: Promise) {
        try {
            stopInternal()              // dừng player cũ và resolve promise cũ (nếu có)
            val mp = MediaPlayer()
            pendingPlayPromise = promise // lưu promise, resolve trong OnCompletion
            mp.setDataSource(path)
            mp.setOnPreparedListener { it.start() }
            mp.setOnCompletionListener {
                it.release()
                if (mediaPlayer === it) {
                    mediaPlayer = null
                    pendingPlayPromise?.resolve(null)
                    pendingPlayPromise = null
                }
            }
            mp.setOnErrorListener { p, what, extra ->
                p.release()
                if (mediaPlayer === p) {
                    mediaPlayer = null
                    pendingPlayPromise?.reject("PLAY_ERROR", "MediaPlayer error: what=$what extra=$extra")
                    pendingPlayPromise = null
                }
                true
            }
            mediaPlayer = mp
            mp.prepareAsync()
            // KHÔNG resolve ở đây — đợi OnCompletionListener hoặc stopInternal()
        } catch (e: Exception) {
            pendingPlayPromise = null
            promise.reject("PLAY_ERROR", e)
        }
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
        // Giải quyết promise đang chờ nếu play bị dừng trước khi hoàn thành
        pendingPlayPromise?.resolve(null)
        pendingPlayPromise = null
    }
}