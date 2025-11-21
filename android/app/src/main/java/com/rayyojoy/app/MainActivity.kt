package com.rayyojoy.app

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import android.os.Build
import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import org.devio.rn.splashscreen.SplashScreen
import com.rayyojoy.app.R
import android.util.Log // For Log.w, Log.d
import com.google.firebase.messaging.FirebaseMessaging // For FirebaseMessaging.getInstance()
import com.google.android.gms.tasks.OnCompleteListener // For OnCompleteListener
import android.app.NotificationChannel
import android.app.NotificationManager

class MainActivity : ReactActivity() {

private val TAG = "FCM_TOKEN_TAG"
  // Declare the launcher at the top of your Activity/Fragment:
  private val requestPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestPermission(),
  ) { isGranted: Boolean ->
    if (isGranted) {
      // FCM SDK (and your app) can post notifications.
      getFirebaseToken()
    } else {
      // TODO: Inform user that that your app will not show notifications.
    }
  }

   private fun getFirebaseToken() {
    try {
      FirebaseMessaging.getInstance().token.addOnCompleteListener(OnCompleteListener { task ->
          if (!task.isSuccessful) {
              Log.w(TAG, "Fetching FCM registration token failed", task.exception)
              return@OnCompleteListener
          }

          // Get new FCM registration token
          val token = task.result

          // Log token
          val msg = getString(R.string.msg_token_fmt, token)
          Log.d(TAG, msg)
      })
    } catch (e: Exception) {
      Log.e(TAG, "Error getting FCM token", e)
    }
  }

  private fun askNotificationPermission() {
    // This is only necessary for API level >= 33 (TIRAMISU)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
        PackageManager.PERMISSION_GRANTED
      ) {
        // FCM SDK (and your app) can post notifications.
        getFirebaseToken()
      } else if (shouldShowRequestPermissionRationale(Manifest.permission.POST_NOTIFICATIONS)) {
        // TODO: display an educational UI explaining to the user the features that will be enabled
        //       by them granting the POST_NOTIFICATION permission. This UI should provide the user
        //       "OK" and "No thanks" buttons. If the user selects "OK," directly request the permission.
        //       If the user selects "No thanks," allow the user to continue without notifications.
        requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
      } else {
        // Directly ask for the permission
        requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
      }
    } else {
        // For devices with API level < 33, just get the token as notifications permission is not required
        getFirebaseToken()
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "pakistan_native_apk"

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(savedInstanceState)
    createNotificationChannel()
    askNotificationPermission()
  }

  private fun createNotificationChannel() {
    // Create the NotificationChannel, but only on API 26+ because
    // the NotificationChannel class is new and not in the support library
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = getString(R.string.default_notification_channel_id)
      val channelName = getString(R.string.default_notification_channel_name)
      val importance = NotificationManager.IMPORTANCE_HIGH
      val channel = NotificationChannel(channelId, channelName, importance).apply {
        description = getString(R.string.default_notification_channel_description)
      }
      // Register the channel with the system
      val notificationManager: NotificationManager =
        getSystemService(NotificationManager::class.java)
      notificationManager.createNotificationChannel(channel)
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
