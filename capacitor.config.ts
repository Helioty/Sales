import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.ferreiracosta.vendas',
  appName: 'Vendas',
  webDir: 'www/browser',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '22',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      resizeOnFullScreen: 'true',
      orientation: 'portrait',
    },
  },
};

export default config;
