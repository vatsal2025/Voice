"use strict";
/**
 * Test setup configuration for Jest
 */
// Increase default timeout for async operations
jest.setTimeout(10000);
// Mock console.log to reduce noise in tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
beforeEach(() => {
    // Mock console methods to reduce noise during testing
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
});
afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
});
// Global error handler for unhandled promise rejections during tests
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    throw reason;
});
//# sourceMappingURL=test-setup.js.map