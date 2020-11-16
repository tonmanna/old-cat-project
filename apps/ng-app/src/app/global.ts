interface addressForm {
  firstName: string;
  lastName: string;
  postOffice: string;
  subDistrict: string;
  district: string;
  province: string;
}

declare global {
  interface Window {
    dataExchanger: addressForm;
  }
}
export class GlobalConstants {
  public static get address() {
    return window.dataExchanger;
  }
  public static set address(data: addressForm) {
    window.dataExchanger = data;
  }
}
