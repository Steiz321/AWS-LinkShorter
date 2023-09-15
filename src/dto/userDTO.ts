
export class UserDTO {
    userId: string;
    email: string;

    constructor(args: any) {
        this.userId = args.userId;
        this.email = args.email;
    }
}