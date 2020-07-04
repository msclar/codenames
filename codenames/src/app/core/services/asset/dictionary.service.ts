import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LanguageEntry {
    language: string;
    words: string[];
}

@Injectable({ providedIn: 'root' })
export class DictionaryService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<LanguageEntry[]> {
    return this.http.get<LanguageEntry[]>('./assets/dictionary-all.json');
  }
}
