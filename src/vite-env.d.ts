/// <reference types="vite/client" />
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare global {
    namespace jest {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface Assertion<T = any>
            extends TestingLibraryMatchers<typeof expect.stringContaining, T> { }
    }
}

declare module "vitest" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Assertion<T = any>
        extends TestingLibraryMatchers<typeof expect.stringContaining, T> { }
    interface AsymmetricMatchersContaining
        extends TestingLibraryMatchers<typeof expect.stringContaining, unknown> { }
}