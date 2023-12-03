const { codeValidationRules } = require("./code");
const { validationResult } = require("express-validator");

describe("codeValidationRules", () => {
  it("should pass validation for a valid code", async () => {
    const req = {
      body: {
        code: "12345", // Valid code with 5 characters
      },
    };
    const validationRules = codeValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it("should fail validation for an empty code", async () => {
    const req = {
      body: {
        code: "", // Empty code
      },
    };

    const validationRules = codeValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe("Enter your verification code");
  });

  it("should fail validation for a code with length other than 5", async () => {
    const req = {
      body: {
        code: "123", // Code with length other than 5
      },
    };

    const validationRules = codeValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(1);
    expect(errors.array()[0].msg).toBe("code must be in 5 digit range");
  });
});
