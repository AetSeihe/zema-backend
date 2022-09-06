export class GetUsersByCordsOptions {
  limit: number;
}

export class GetUsersByCordsData {
  startCordX: number;
  finishCordX: number;
  startCordY: number;
  finishCordY: number;
}

export class GetUsersByCordsDTO {
  options: GetUsersByCordsOptions;
  data: GetUsersByCordsData;
}
