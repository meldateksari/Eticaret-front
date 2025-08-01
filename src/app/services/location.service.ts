import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class LocationService {

  constructor(private http: HttpClient) {}

  // Ülkeleri API'den çek
  getCountries(): Observable<any[]> {

    const url = 'https://restcountries.com/v3.1/all?fields=name,cca2';

    return this.http.get<any[]>(url).pipe(
      map(countries => {
        return countries.map(country => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a, b) => a.name.localeCompare(b.name));
      }),
      catchError(error => {
        console.error('Ülkeler yüklenirken hata:', error);
        return of([]);
      })
    );
  }

  getCities(countryCode: string): Observable<any> {
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}&limit=10`;

    const headers = new HttpHeaders({
      'X-RapidAPI-Key': '64e47f42d0msh1ec84d8562ef5bcp1fdc9fjsn18d7ee83a4ad',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    });

    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        console.error('Şehirler yüklenirken hata:', error);
        return of({ data: [] });
      })
    );
  }
}
