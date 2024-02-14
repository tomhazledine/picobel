import picobel from "./";

describe("Main app", () => {
    it("runs without breaking", () => {
        let instance = picobel();
        expect(typeof instance.state).toBe("object");
    });
});
