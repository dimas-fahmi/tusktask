import {
  Car,
  Cast,
  Cpu,
  Gamepad2,
  HardDrive, // Added for storage/heavy server OS contexts if needed, used Server mostly below
  Laptop,
  type LucideIcon,
  Monitor,
  Server,
  Smartphone,
  Tablet,
  Tv,
  Watch,
} from "lucide-react";
import type { OSName } from "ua-parser-js/enums";

export type OsKey = (typeof OSName)[keyof typeof OSName];

export const OS_NAME_ICON: Record<OsKey, LucideIcon> = {
  // --- Mobile/Handheld ---
  Android: Smartphone,
  "Android-x86": Laptop, // Usually run on netbooks/laptops
  iOS: Smartphone,
  Bada: Smartphone,
  BlackBerry: Smartphone,
  "Firefox OS": Smartphone,
  KaiOS: Smartphone,
  Maemo: Tablet, // N900/N810 era
  Palm: Smartphone,
  "RIM Tablet OS": Tablet,
  Sailfish: Smartphone,
  Series40: Smartphone,
  Symbian: Smartphone,
  Tizen: Smartphone, // Also Watch/TV, but primarily detected on mobile UAs
  "Ubuntu Touch": Smartphone,
  WebOS: Tv, // Originally Palm, but now primarily LG TVs
  "Windows Mobile": Smartphone,
  "Windows Phone": Smartphone,
  MeeGo: Smartphone,

  // --- Desktop/Personal Computing ---
  Windows: Monitor,
  macOS: Monitor,
  "Amiga OS": Monitor,
  ArcaOS: Monitor,
  BeOS: Monitor,
  Haiku: Monitor,
  "OS/2": Monitor,
  "Chrome OS": Laptop, // Chromebooks
  "Windows RT": Tablet, // Surface RT devices

  // --- Linux Distributions (Desktop Focus) ---
  Linux: Monitor, // Generic Linux
  Deepin: Monitor,
  "elementary OS": Monitor,
  Kubuntu: Monitor,
  Linpus: Laptop, // Often found on older Acer netbooks
  Linspire: Monitor,
  Mageia: Monitor,
  Mandriva: Monitor,
  Manjaro: Monitor,
  Mint: Monitor,
  "PC-BSD": Monitor,
  PCLinuxOS: Monitor,
  Sabayon: Monitor,
  Ubuntu: Monitor,
  VectorLinux: Monitor,
  Xubuntu: Monitor,
  Zenwalk: Monitor,
  Arch: Monitor,
  GhostBSD: Monitor,
  Knoppix: HardDrive, // Famous for Live CD/USB usage

  // --- Linux/Unix (Server/Infrastructure Focus) ---
  AIX: Server,
  CentOS: Server,
  Debian: Server, // Dual use, but huge in servers
  DragonFly: Server,
  Fedora: Server, // Workstation/Server split, but often dev/server
  FreeBSD: Server,
  Gentoo: Server,
  GNU: Server,
  Hurd: Server,
  NetBSD: Server,
  OpenBSD: Server,
  OpenVMS: Server,
  RedHat: Server,
  Slackware: Server,
  Solaris: Server,
  SUSE: Server,
  Unix: Server,
  "HP-UX": Server,
  Plan9: Server, // Distributed OS

  // --- Embedded/IoT/Smart Devices ---
  Chromecast: Cast,
  "Chromecast Android": Cast,
  "Chromecast Fuchsia": Cast,
  "Chromecast Linux": Cast,
  "Chromecast SmartSpeaker": Cast,
  Contiki: Cpu,
  Fuchsia: Cpu, // Experimental, runs on Nest Hubs etc
  HarmonyOS: Smartphone, // Huawei ecosystem
  Joli: Laptop, // Cloudbook OS
  Minix: Cpu,
  "Morph OS": Monitor,
  NetRange: Tv,
  NetTV: Tv,
  OpenHarmony: Cpu,
  Pico: Cpu,
  QNX: Car, // Heavily used in Automotive
  "RISC OS": Monitor,
  SerenityOS: Monitor,
  Raspbian: Cpu, // Raspberry Pi (SBC)
  "Windows CE": Cpu, // Handheld/Embedded
  "Windows IoT": Cpu,

  // --- Gaming/Console ---
  Nintendo: Gamepad2,
  PlayStation: Gamepad2,
  Xbox: Gamepad2,

  // --- Wearable ---
  watchOS: Watch,
} as const;
