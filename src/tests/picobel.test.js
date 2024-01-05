import Picobel from "../js/Picobel";

describe("Main app", () => {
    it("runs without breaking", () => {
        let instance = Picobel();
        expect(typeof instance.state).toBe("object");
    });
});
