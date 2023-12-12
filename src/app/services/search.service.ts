import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public querySubject = new Subject<string>();
  public query$ = this.querySubject.asObservable();
}
