export default class UserResponse {

  private _status:number
  private _message:string
  private _data?:any


    constructor(status: number, message: string, body: any) {
        this._status = status;
        this._message = message;
        this._data= body;
    }

    get status(): number {
        return this._status;
    }

    set status(value: number) {
        this._status = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    toJSON(){

      return{
          status:this._status,
          message:this.message,
          data:this._data
      }

    }
}