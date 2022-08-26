import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderModule } from 'ngx-order-pipe';
import { FormsModule} from '@angular/forms';
import { MaterialModuleControls } from '../../material.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BMSTableComponent } from './bmstable.component';
import { BMSTableRowComponent } from './bmstablerow.component';
import { BMSTableCellComponent } from './bmstablecell.component';
import { cardContainerComponent } from './flexDesign/Card_Container/cardContainer.component';
import { CardContentComponent } from './flexDesign/Card_Content/card.component';
import { CardfilterDatacolorPipe, CardfilterHoverPipe, CardFilterPipe, CardImgFilterPipe } from './flexDesign/Card_Content/filter.pipe';
import { FlexCardHoverDirective } from './flexDesign/Card_Content/FlexCardHover.directive';


@NgModule({
    imports: [
        CommonModule,
        OrderModule,
        NgbDropdownModule,
        FormsModule,
        MaterialModuleControls
    ],
    declarations: [ 
         BMSTableComponent,
         BMSTableRowComponent, 
         BMSTableCellComponent,
         cardContainerComponent,
         CardContentComponent,
         CardFilterPipe,
         CardImgFilterPipe,
         CardfilterHoverPipe,
         FlexCardHoverDirective,
         CardfilterDatacolorPipe],
    providers: [],
    exports: [CommonModule, BMSTableComponent, BMSTableRowComponent, BMSTableCellComponent,cardContainerComponent]
})
export class BMSTableModule {

}

