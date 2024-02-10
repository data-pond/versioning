import {describe, expect, test} from "vitest";
import VersionCheck, {Platforms} from '../src/index';

describe('The browser client', () => {

    const contractId = '2yVor8mhpZiELinh-l6UOSWC2pQowa9-LNnQnSqoGBk';
    const platform = Platforms.Windows;

    test(`get the latest version`, async () => {
        const check = VersionCheck(platform, contractId);
        const version = await check.GetLastVersion();
        expect(version.version).eq("1.0")
        expect(version.url).eq("test url")
    }, 20000)

})