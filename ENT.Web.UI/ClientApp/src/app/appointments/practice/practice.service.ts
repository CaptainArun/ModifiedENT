import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { facilityModel } from "src/app/configuration/Models/facilityModel";
import { CustomHttpService } from "src/app/core/custom-http.service";

@Injectable({
    providedIn: 'root',
})

export class PracticePartService {

    constructor(private http: CustomHttpService) { }

    fetchAllFacilityData(): Promise<any> {
        return this.http.get('/TenantMaster/GetAllFacilities').then(res => res);
    }

    getFacilityById(facilityId: number): Promise<any> {
        return this.http.get('/TenantMaster/GetFacilitybyID?facilityId=' + facilityId).then(res => res);
    }

    addUpdateFacility(Formval: facilityModel): Promise<any> {
        return this.http.post('/TenantMaster/AddUpdateFacility', Formval).then(res => res);
    }

    getAllSpecialities(): Promise<any> {
        return this.http.get('/TenantMaster/GetAllSpecialities').then(res => res);
    }
}