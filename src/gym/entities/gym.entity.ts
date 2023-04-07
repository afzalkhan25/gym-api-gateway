export interface Gym {
  id: string;
  gymName: string;
  mobileNo: number;
  email: string;
  panNo: string;
  gstNo: string;
  aadhar?: string;
  address: Address;
}

export interface Address {
  line1: string;
  line2: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}
