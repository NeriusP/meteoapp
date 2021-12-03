import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as data from './../cities.json';
import { MeteoData } from './meteodata.model';
import { MeteoOutput } from './meteooutput.model';

@Injectable()
export class MeteodataService {
    cities: any = data;

    constructor(private http: HttpClient) { }

    getMeteodata(citycode: string) {
    //   this.http.get('https://api.meteo.lt/v1/places/${citycode}/forecasts/long-term') // requestas, kuris neveikia dėl CORS - cross-origin request'o apribojimų
      return this.http.get(`http://localhost:4200/api/${citycode}/forecasts/long-term`) // requestas, nukreiptas per proxy
      .pipe(map(
        // skirta atrinkti ir pertvarkyti gautiems API duomenims
        (meteoData: MeteoData) => {
          const meteoArray: MeteoOutput[] = [];
          let firstDate = new Date(meteoData.forecastTimestamps[0].forecastTimeUtc).getDate();
          const lastDate = new Date(meteoData.forecastTimestamps[meteoData.forecastTimestamps.length-1].forecastTimeUtc).getDate();
          const date = new Date();
          let tempDate = new Date();
          let incrDate = new Date(tempDate.setHours(date.getHours() + 1)); 
          let dayForecastCounter: number;  // skaitiklis vidutinei dienos temperatūrai skaičiuoti
          let nightForecastCounter: number;  // skaitiklis vidutinei nakties temperatūrai skaičiuoti
          let dayAvgForecastTemperature: number;  // vidutinė dienos temperatūra
          let nightAvgForecastTemperature: number;  // vidutinė nakties temperatūra
          let forecastedDate: Date;   // prognozės dienos data
          let forecastedDayWeather: string;  // dienos oros sąlygos
          let forecastedNightWeather: string; // nakties oros sąlygos
          // tikrina, ar gautuose duomenyse yra senų duomenų (praėjusios dienos prognozių)
          if (firstDate != date.getDate()){
            firstDate += 1;
          }
         // tikriname kiekvienos dienos prognozes. kadangi einamosios dienos prognozės yra nepilnos, 
         // dienos oro sąlygas imame iš artimiausios valandos prognozės duomenų. 
         //Kitų dienų oro sąlygos imamos: nakties - 00:00 valandą, dienos - 12:00 valandą.
         
          
          for (let i = firstDate; i <= lastDate; i++ ){

            dayForecastCounter = 0; 
            nightForecastCounter = 0; 
            dayAvgForecastTemperature = 0; 
            nightAvgForecastTemperature = 0; 
            forecastedDayWeather = ""; 
            forecastedNightWeather = ""; 
            //
            for (const forecast of meteoData.forecastTimestamps) {
              const forecastDate = new Date (forecast.forecastTimeUtc);
              if (forecastDate.getDate() === firstDate && i === firstDate) { // tikrina tik pirmos dienos prognozes
                if (forecastDate > date) {                                  // atmeta senesnes už dabartinę datas
                  if (forecastDate.getHours() > 0 && forecastDate.getHours() < 8 && forecastDate < incrDate) { // nakties valandomis laikau nuo 0 iki 8 ryto
                    forecastedNightWeather = forecast.conditionCode;
                  } 
                  if (forecastDate.getHours() > 12 && forecastDate.getHours() < 24 && forecastDate < incrDate) {
                    forecastedDayWeather = forecast.conditionCode;
                    
                  }
                }
              }
                if(forecastDate.getDate() === i){
                  forecastedDate = forecastDate; 
                  if (forecastDate.getHours() === 0) {
                    forecastedNightWeather = forecast.conditionCode;
                  }
                  if (forecastDate.getHours() === 12) {
                    forecastedDayWeather = forecast.conditionCode;
                  }
                  if(forecastDate.getHours() >= 8) {
                    dayAvgForecastTemperature += forecast.airTemperature;
                    dayForecastCounter++;
                  } else {
                    nightAvgForecastTemperature += forecast.airTemperature;
                    nightForecastCounter++;
                  }
                }
            }
            meteoArray.push({
              forecastedDate: forecastedDate, 
              dayAvgTemperature: !isNaN(dayAvgForecastTemperature/dayForecastCounter) ? (dayAvgForecastTemperature/dayForecastCounter).toFixed(2) : null,
              dayWeather: forecastedDayWeather,
              nightAvgTemperature: !isNaN(nightAvgForecastTemperature/nightForecastCounter) ? (nightAvgForecastTemperature/nightForecastCounter).toFixed(2) : null,
              nightWeather: forecastedNightWeather
            })
          }
        return meteoArray;
        }
      ));
    
    }

}