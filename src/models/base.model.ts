export class BaseModel<T>{

  /**
   * Table
   */
  public db: any;

  /**
   * Get all itens in table
   * 
   * @returns item list from database
   */
  public list () {
    return this.db
      .value();
  }

  /**
   * Find item by id
   * 
   * @param id item ID
   * @returns item from database
   */
  public findById (id: string) {
    return this.db
      .find({ id })
      .value();
  }


  /**
   * Add a new item into database;
   * 
   * @param data item
   */
  public add(data: T) {
    this.db
      .push(data)
      .write();
  }

  /**
   * Update data by id
   * 
   * @param data item
   */
  public update(id: string, data: T) {
    this.db
      .find({ id })
      .assign(data)
      .write();
  }

  /**
   * Update data by id if exist or add if is a new data
   * 
   * @param data item
   */
  public updateOrAdd(id: string, data: T) {
    if(this.findById(id)){
      this.update(id, data);
    } else {
      this.add(data);
    }
  }

  /**
   * Remove an element from database 
   * @param id item ID
   */
  public remove(id: string) {
    this.db
      .remove({ id })
      .write();
  }
}