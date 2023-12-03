const { userValidationRules } = require("./user");
const { validationResult } = require("express-validator");

describe("userValidationRules", () => {
  it("should pass validation for a valid user", async () => {
    const req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "123456789",
      },
    };
    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it("should fail validation for an empty first name", async () => {
    const req = {
      body: {
        firstName: "",
        lastName: "Doe",
        phoneNumber: "123456789",
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe("Enter your first name");
  });
  it("should fail validation for an empty phone number", async () => {
    const req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "",
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe("Enter a phone number");
  });
  it("should fail validation for an invalid phone number", async () => {
    const req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "invalid-phoneNumber",
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(1);
    expect(errors.array()[0].msg).toBe("Enter your phone Number without zero");
  });

  it("should fail validation for an empty last name", async () => {
    const req = {
      body: {
        firstName: "John",
        lastName: "",
        phoneNumber: "123456789",
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe("Enter your last name");
  });
});
