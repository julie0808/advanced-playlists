export class Tag {
  public name: string;
  public objectId: string;
  //public parentId: string; 

  constructor(name: string, objectId: string) {
    this.name = name;
    this.objectId = objectId;
  }
}