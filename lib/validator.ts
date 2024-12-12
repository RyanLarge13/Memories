interface EscapeMap {
  [key: string]: string;
}

class Validator {
  constructor() {}

  valStr(
    string: string,
    minLength: number = 3,
    maxLength: number = 10,
    customRegex: RegExp = /<script.*?>.*?<\/script>|on\w+\s*=\s*['"]?[^'"]*['"]?|javascript:/gi,
    customEscapeMap: EscapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
  ): boolean {
    string.trim();
    if (typeof string !== "string") {
      console.log("Does not equal string");
      return false;
    }
    const stringLength: number = string.length;
    if (stringLength < minLength || stringLength > maxLength) {
      console.log("string length params failed");
      return false;
    }
    const dangerousPatterns = string.match(customRegex);
    if (dangerousPatterns) {
      console.log("Regex failed!");
      return false;
    }
    string.replace(
      new RegExp(`[${Object.keys(customEscapeMap).join("")}]`),
      (match) => customEscapeMap[match]
    );
    return true;
  }

  valInt(
    number: number,
    testLen: boolean,
    minSize: number = 0,
    maxSize: number = 100000,
    customRegex: RegExp = /^\d+$/
  ): boolean {
    if (typeof number !== "number") {
      return false;
    }
    if (!testLen) {
      if (number < minSize || number > maxSize) {
        return false;
      }
    }
    const stringifiedNumber = number.toString();
    if (testLen) {
      if (
        stringifiedNumber.length > maxSize ||
        stringifiedNumber.length < minSize
      ) {
        return false;
      }
    }
    const isAValidNumber = customRegex.test(stringifiedNumber);
    if (!isAValidNumber) {
      return false;
    }
    if (!Number.isInteger(number)) {
      return false;
    }
    return true;
  }

  valUsername(username: string) {
    const isValidName = this.valStr(username, 20, 3);
    if (!isValidName) {
      return false;
    }
    return true;
  }

  valEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (typeof email !== "string") {
      return false;
    }
    const isValidEmail = this.valStr(email, 50, 5, emailRegex, {});
    if (!isValidEmail) {
      return false;
    }
    return true;
  }

  valPassword(password: string) {
    if (typeof password !== "string") {
      return false;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = this.valStr(password, 40, 8, passwordRegex, {});
    if (!isValidPassword) {
      return false;
    }
    return true;
  }

  valPhoneNumber(phoneNumber: string) {
    if (typeof phoneNumber !== "string") {
      return;
    }
    const phoneRegex = /^(\(\d{3}\)-\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/;
    const isValidPhone = this.valStr(phoneNumber, 14, 12, phoneRegex, {
      "(": "",
      ")": "",
      "-": "",
    });
    const formattedNum = phoneNumber.replace(/[()-]/g, "");
    const phoneNumberNums = Number(formattedNum);
    const isValidNumber = this.valInt(phoneNumberNums, true, 10, 10, undefined);
    if (!isValidPhone) {
      return false;
    }
    if (!isValidNumber) {
      return false;
    }
    return true;
  }
}

export default Validator;
