const { coderValidationRules } = require("./coder");
const { validationResult } = require("express-validator");

describe("coderValidationRules", () => {
  it("should pass validation for a email", async () => {
    const req = {
      body: {
        email: "john.doe@example.com", // Valid phone number without zero
      },
    };
    const validationRules = coderValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it("should fail validation for an invalid email", async () => {
    const req = {
      body: {
        email: "invalid-email", // invalid email
      },
    };

    const validationRules = coderValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(1);
    expect(errors.array()[0].msg).toBe("Enter Valid email address");
  });
});
