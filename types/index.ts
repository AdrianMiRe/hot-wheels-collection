import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Car = {
  masterBrand: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  collection: string;
  blisterType: string;
  isPremium: boolean;
  url: string;
};

export type State = {
  car: Car
}

export type CarAction = 
| { type: "UPDATE_FIELD", payload: { field: string, value: string | boolean} }
| { type: "SET_URL", payload: { url: string} }