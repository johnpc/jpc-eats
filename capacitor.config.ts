import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.johncorser.eats",
  appName: "jpc.eats",
  webDir: "dist",
  server: {
    hostname: "eats.jpc.io",
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
    backgroundColor: "#F5DEB3",
  },
};

export default config;
