import { CarAction, State } from "@/types";

export const initialState: State = {
  car: {
    masterBrand: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    collection: "",
    blisterType: "",
    isPremium: false,
    url: ""
  }
};

export const carReducer = (state: State, action: CarAction): State => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        car: {
          ...state.car,
          [action.payload.field]: action.payload.value
        }
      };
    case "SET_URL":
      return {
        ...state,
        car: { ...state.car, url: action.payload.url }
      };
    default:
      return state;
  }
}