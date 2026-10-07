export interface ItemInfo {
  itemId: string;
  name: string;
  description: string;
  rarity: string;
  iconId: string;
  overrideBkg: object;
  stackIconId: object;
  sortId: number;
  usage: string;
  obtainApproach: string;
  hideInItemGet: boolean;
  classifyType: string;
  itemType: string;
  stageDropList: object[];
  buildingProductList: object;
  voucherRelateList: object;
  shopRelateInfoList: object;
}
