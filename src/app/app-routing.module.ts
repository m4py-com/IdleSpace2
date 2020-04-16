import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnitsComponent } from "./units/units.component";
import { LaboratoryComponent } from "./laboratory/laboratory.component";
import { OptionsComponent } from "./options/options.component";
import { SaveComponent } from "./save/save.component";
import { AddComponent } from "./designer/add/add.component";
import { TechnologiesComponent } from "./technologies/technologies.component";
import { EditComponent } from "./designer/edit/edit.component";
import { ShipyardComponent } from "./shipyard/shipyard.component";
import { SearchComponent } from "./enemy/search/search.component";
import { EnemiesListComponent } from "./enemy/enemies-list/enemies-list.component";
import { EnemyDetailComponent } from "./enemy/enemy-detail/enemy-detail.component";
import { BattleComponent } from "./battle/battle.component";
import { ModulesComponent } from "./designer/modules/modules.component";
import { BattleReportComponent } from "./battle-report/battle-report.component";
import { SpaceStationsComponent } from "./space-stations/space-stations.component";
import { TreeComponent } from "./laboratory/tree/tree.component";
import { ModComponent } from "./units/mod/mod.component";
import { ListComponent } from "./designer/list/list.component";
import { BiComponent } from "./units/bi/bi.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/units/ws" },
  { path: "des", pathMatch: "full", redirectTo: "/des/add" },
  { path: "enemyList", pathMatch: "full", redirectTo: "/enemyList/search" },
  { path: "units/:id", pathMatch: "full", component: UnitsComponent },
  { path: "bi", pathMatch: "full", component: BiComponent },
  { path: "mod/:id", pathMatch: "full", component: ModComponent },
  { path: "lab", pathMatch: "full", component: LaboratoryComponent },
  { path: "tech", pathMatch: "full", component: TechnologiesComponent },
  { path: "tree", pathMatch: "full", component: TreeComponent },
  { path: "opt", pathMatch: "full", component: OptionsComponent },
  { path: "save", pathMatch: "full", component: SaveComponent },
  { path: "fleet", pathMatch: "full", component: ShipyardComponent },
  {
    path: "des",
    component: ListComponent,
    children: [
      { path: "edit/:id", component: EditComponent },
      { path: "add", component: AddComponent }
    ]
  },
  { path: "search", component: SearchComponent },
  { path: "battle", component: BattleComponent },
  { path: "report", component: BattleReportComponent },
  { path: "modules", component: ModulesComponent },
  { path: "space", component: SpaceStationsComponent },
  {
    path: "enemyList",
    component: EnemiesListComponent,
    children: [
      {
        path: "enemyDetail/:id",
        pathMatch: "full",
        component: EnemyDetailComponent
      },
      { path: "search", pathMatch: "full", component: SearchComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
