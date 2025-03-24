import picobel from "./";

describe("Main app", () => {
    it("runs without breaking", () => {
        const instance = picobel();
        expect(typeof instance.state).toBe("object");
    });
});
