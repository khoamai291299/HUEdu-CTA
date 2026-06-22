# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-sqlite-storage
-keep class org.pgsqlite.** { *; }
-dontwarn org.pgsqlite.**

# react-native-tts
-keep class net.no_mad.tts.** { *; }
-dontwarn net.no_mad.tts.**

# react-native-fs
-keep class com.rnfs.** { *; }
-dontwarn com.rnfs.**

# react-native-reanimated & gesture-handler
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.reanimated.**

# React Native Core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.yoga.** { *; }
-dontwarn com.facebook.react.**

# Worklets
-keep class com.worklets.** { *; }
-dontwarn com.worklets.**
