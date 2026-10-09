import { Injectable } from '@angular/core';

export type DeviceOs = 'android' | 'ios' | 'desktop' | 'unknown';
export type DeviceArch = 'arm64' | 'arm32' | 'x86_64' | 'x86_32' | 'unknown';

export interface CompatibilityResult {
  compatible: boolean;
  os: DeviceOs;
  arch: DeviceArch;
  message: string | null;
}

export const SUPPORTED_ABIS = ['arm64-v8a', 'armeabi-v7a'];

@Injectable({ providedIn: 'root' })
export class DeviceCompatibilityService {
  check(): CompatibilityResult {
    const os = this.detectOs();
    const architecture = this.detectArch();
    const isX86 = architecture === 'x86_64' || architecture === 'x86_32';
    const isArm = architecture === 'arm64' || architecture === 'arm32';

    if (os === 'ios') {
      return {
        compatible: false,
        os,
        arch: 'arm64',
        message:
          'La aplicación svApp solo está disponible para dispositivos Android (ABIs arm64-v8a y armeabi-v7a). Tu iPhone o iPad no es compatible.',
      };
    }

    if (os === 'android') {
      if (isX86) {
        return {
          compatible: false,
          os,
          arch: architecture,
          message:
            'Tu dispositivo usa una arquitectura ' +
            (architecture === 'x86_64' ? 'x86_64' : 'x86') +
            ' que no es compatible con la aplicación. La app solo soporta dispositivos ARM (arm64-v8a y armeabi-v7a).',
        };
      }

      if (isArm) {
        return {
          compatible: true,
          os,
          arch: architecture,
          message: null,
        };
      }

      return {
        compatible: true,
        os,
        arch: 'unknown',
        message: null,
      };
    }

    return {
      compatible: true,
      os,
      arch: architecture,
      message: null,
    };
  }

  supportedAbis(): string[] {
    return [...SUPPORTED_ABIS];
  }

  private detectOs(): DeviceOs {
    const ua = navigator.userAgent;
    const brands = (navigator as unknown as { userAgentData?: { platform?: string } })
      .userAgentData;

    const platform = brands?.platform;
    if (platform) {
      if (platform === 'Android') return 'android';
      if (platform === 'iOS' || platform === 'iPhone' || platform === 'iPad') return 'ios';
      if (/^Mac|Win|Linux/.test(platform)) return 'desktop';
    }

    if (/android/i.test(ua)) return 'android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/windows|mac os x|macintosh|linux|cros/i.test(ua)) return 'desktop';
    return 'unknown';
  }

  private detectArch(): DeviceArch {
    const ua = navigator.userAgent;

    const isX86Hint = /x86_64|amd64|x86|i686|i386|intel|i86pc/i.test(ua);
    const isArmHint = /arm|aarch64|aarch32|crOS\s+arm/i.test(ua);
    const is64Bit = this.is64Bit();

    if (isX86Hint && is64Bit) return 'x86_64';
    if (isX86Hint) return 'x86_32';
    if (isArmHint && is64Bit) return 'arm64';
    if (isArmHint) return 'arm32';
    if (is64Bit) return 'arm64';

    return 'unknown';
  }

  private is64Bit(): boolean {
    const hasBigInt = typeof BigInt64Array === 'function' && typeof BigUint64Array === 'function';
    const hasWasm = typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function';

    if (hasWasm) {
      try {
        new WebAssembly.Memory({ initial: 1, maximum: 65537 });
        return true;
      } catch {
        return false;
      }
    }

    return hasBigInt;
  }
}
