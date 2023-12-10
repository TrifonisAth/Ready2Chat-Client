import { Person } from './person';

export class Friend {
  private id: number;
  private name: string;
  private isOnline: boolean;
  private friendshipId: number;

  constructor(friendDTO: any) {
    this.id = friendDTO.id;
    this.name = friendDTO.name;
    this.isOnline = friendDTO.isOnline;
    this.friendshipId = friendDTO.friendshipId;
  }

  getFriendshipId(): number {
    return this.friendshipId;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getIsOnline(): boolean {
    return this.isOnline;
  }

  setIsOnline(isOnline: boolean): void {
    this.isOnline = isOnline;
  }

  toPerson(): Person {
    return new Person({
      id: this.id,
      name: this.name,
    });
  }
}
