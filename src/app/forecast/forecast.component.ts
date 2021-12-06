import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MeteodataService } from '../shared/meteodata.service';
// import { Skycons } from 'skycons-ts';
import { MeteoOutput } from '../shared/meteooutput.model';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  

  cities: {name: string, code: string}[] = [];
  city: {name: string, code: string};
  gettingData: boolean = false;
  error = null;
  meteodata: MeteoOutput[];
  displayDay: boolean = true;

  constructor(private meteodataService: MeteodataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // iš serviso importuojami iš failo nuskaityti pradiniai miestų duomenys 
    this.cities = this.meteodataService.cities.default;
        
    // stebimi routo parametrai, jei jie teisingi, siunčiama užklausa duomenims iš API gauti
    this.route.params.subscribe(
      (params: Params) => {
        this.city = this.cities.find(city => city.code === params['citycode']);
        
        if (this.city) {
          this.onGetMeteodata(this.city.code);
          
          
        }
      }
    );
  }

  // skirta kreiptis į servisą ir gauti duomenis iš API
  onGetMeteodata(citycode: string) {
    this.gettingData = true;
    
    this.meteodataService.getMeteodata(citycode).subscribe(
      data => {
        this.gettingData = false;
        this.meteodata = data;
      },
      error => {
        this.error = error;
        console.log(error);
      }
    );
  }
// skirta perduoti awesomefonts ikonų klases į templeitą dienos prognozėms
   getMeteoIcon(meteoCode: string, isDay: boolean = true) {
    let classNames: string;
      switch(meteoCode) {
        case 'clear': classNames = isDay ? "far fa-sun" : "far fa-moon";
        break;
        case 'isolated-clouds': classNames = isDay ? "fas fa-cloud-sun" : "fas fa-cloud-moon";
        break;
        case 'scattered-clouds': classNames = isDay ? "fas fa-cloud-sun" : "fas fa-cloud-moon";
        break;
        case 'overcast': classNames = "fas fa-cloud";
        break;
        case 'light-rain': classNames = "fas fa-cloud-rain";
        break;
        case 'moderate-rain': classNames = "fas fa-cloud-rain";
        break;
        case 'heavy-rain': classNames = "fas fa-cloud-rain";
        break;
        case 'light-snow': classNames = "fas fa-cloud-rain";
        break;
        case 'moderate-snow': classNames = "fas fa-cloud-rain";
        break;
        case 'heavy-snow': classNames = "far fa-snowflake";
        break;
        case 'sleet': classNames = "fas fa-cloud-showers-heavy";
        break;
        case 'fog': classNames = "fas fa-smog";
        break;
        case 'na': classNames = "fas fa-rainbow";
        break;
        // default:  classNames = "fas fa-minus"
      }
    return classNames;
  }

  //skirta perduoti savaitės dieną į templeitą
  getDayOfTheWeek(dayNo: number) {
    let day: string = "";
    switch(dayNo) {
      case 1 : day = "Pirmadienis";
      break;
      case 2 : day = "Antradienis";
      break;
      case 3 : day = "Trečiadienis";
      break;
      case 4 : day = "Ketvirtadienis";
      break;
      case 5 : day = "Penktadienis";
      break;
      case 6 : day = "Šeštadienis";
      break;
      case 0 : day = "Sekmadienis";
      break;
    }
    return day;
  }

  // initSkycons(){
  //   const skycons = new Skycons({'color': 'black'});
  //   skycons.add('icon1d', 'clear-day'); // clear                 
  //   skycons.add('icon1n', 'clear-night');                        
  //   skycons.add('icon2d', 'partly-cloudy-day'); //isolated-clouds  
  //   skycons.add('icon2n', 'partly-cloudy-night');                  
  //   skycons.add('icon3', 'cloudy'); // overcast                    
  //   skycons.add('icon4', 'rain'); // light-rain, moderate-rain, heavy-rain
  //   skycons.add('icon5', 'sleet'); // sleet                               
  //   skycons.add('icon6', 'snow'); //light-snow, moderate-snow, heavy-snow 
  //   skycons.add('icon7', 'fog'); // fog 
  //   skycons.add('icon8', 'wind'); // na 
  //   skycons.play();
  // };

}
