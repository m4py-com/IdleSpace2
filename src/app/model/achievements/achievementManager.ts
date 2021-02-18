import { Bonus } from "../bonus/bonus";
import {
  BUILDINGS_LEVELS,
  BUILD_IDS,
  IDS,
  ONE,
  WORKERS_LEVELS,
  WORKER_BONUS
} from "../CONSTANTS";
import { ACHIEVEMENTS_DATA } from "../data/achievementData";
import { Game } from "../game";
import { Achievement } from "./achievement";
import { AchievementGroup } from "./achievementGroup";
import { EnemyLevelAck } from "./enemyLevelAck";
import { UnitQuantityAck } from "./unitQuantityAck";

export class AchievementManager {
  achievements: Array<Achievement>;
  groups: Array<AchievementGroup>;
  //#region Origins
  scienceAck: Achievement;
  warAck: Achievement;
  buildersAck: Achievement;
  //#endregion
  //#region Specialization
  megaBuildersAck: Achievement;
  moddersAck: Achievement;
  explorerAck: Achievement;
  //#endregion
  constructor() {
    this.groups = [
      new AchievementGroup("or", "Factions"),
      new AchievementGroup("eco", "Economy")
    ];
    this.achievements = [];
    for (const aData of ACHIEVEMENTS_DATA) {
      let ret: Achievement;
      switch (aData.groupId) {
        case "or":
          ret = new EnemyLevelAck(aData);
          break;
      }
      this.achievements.push(ret);
    }

    const rm = Game.getGame().resourceManager;
    //#region Worker Achievements
    rm.workers.forEach((w) => {
      const ackData = {
        id: "w" + w.id,
        name: w.name,
        description:
          "Get #level@ " +
          w.name +
          ". " +
          w.name +
          " yeild " +
          WORKER_BONUS * 100 +
          "% more.",
        icon: w.icon,
        colorClass: w.colorClass,
        groupId: "eco",
        levels: WORKERS_LEVELS,
        workerId: w.id
      };
      const ack = new UnitQuantityAck(ackData);
      ack.unit = w;
      this.achievements.push(ack);
      w.prodEfficiency.bonuses.push(new Bonus(ack, new Decimal(WORKER_BONUS)));
    });
    //#endregion
    //#region Buildings Achievements
    rm.buildings.forEach((b) => {
      const hasDep = b.departments?.length > 0 ?? false;
      const ackData = {
        id: "w" + b.id,
        name: b.name,
        description:
          "Get #level@ " +
          b.name +
          ". " +
          (hasDep ? "+1 " + b.name + " departments." : "+100% storage."),
        icon: b.icon,
        colorClass: b.colorClass,
        groupId: "eco",
        levels: BUILDINGS_LEVELS,
        workerId: b.id
      };
      const ack = new UnitQuantityAck(ackData);
      ack.unit = b;
      this.achievements.push(ack);
      if (hasDep) {
        b.departmentsAck = ack;
      } else {
        const bonus = new Bonus(ack, ONE);
        switch (b.id) {
          case BUILD_IDS.Batteries:
            rm.energy.limitStackMulti.bonuses.push(bonus);
            break;
          case BUILD_IDS.DroneDepot:
            rm.components.limitStackMulti.bonuses.push(bonus);
            break;
          case BUILD_IDS.NukeSilos:
            rm.nuke.limitStackMulti.bonuses.push(bonus);
            break;
        }
      }
    });
    //#endregion

    this.achievements.forEach((ack) => {
      const group = this.groups.find((gr) => gr.id === ack.groupId);
      group.list.push(ack);
      group.total += ack.max;
      ack.parent = group;
    });

    this.scienceAck = this.achievements.find((a) => a.id === "os");
    this.warAck = this.achievements.find((a) => a.id === "ow");
    this.buildersAck = this.achievements.find((a) => a.id === "ob");
    this.megaBuildersAck = this.achievements.find((a) => a.id === "smb");
    this.moddersAck = this.achievements.find((a) => a.id === "sm");
    this.explorerAck = this.achievements.find((a) => a.id === "sm");
  }
  afterInit() {
    this.achievements.forEach((ack) => ack.updateDescription());

    const rs = Game.getGame().resourceManager;
    const sy = Game.getGame().shipyardManager;
    const sp = Game.getGame().spaceStationManager;
    const em = Game.getGame().enemyManager;

    rs.worker.prodEfficiency.bonuses.push(
      new Bonus(this.buildersAck, new Decimal(0.5))
    );
    sy.velocityBonusStack.bonuses.push(
      new Bonus(this.warAck, new Decimal(0.2))
    );
    sp.megaBonuses.push(new Bonus(this.megaBuildersAck, new Decimal(1)));
    em.districtMultiplier.bonuses.push(
      new Bonus(this.explorerAck, new Decimal(0.1))
    );
  }
  onDefeatEnemyAchievements() {
    let done = false;
    const game = Game.getGame();

    //  Origins
    if (game.researchManager.scienceOrigin.quantity.gte(1)) {
      done = this.scienceAck.complete();
      if (done) game.researchManager.researches.forEach((res) => res.loadMax());
    } else if (game.researchManager.warOrigin.quantity.gte(1)) {
      this.warAck.complete();
    } else if (game.researchManager.buildersOrigin.quantity.gte(1)) {
      this.buildersAck.complete();
    }

    //  Specializations
    if (game.researchManager.megaBuildersSpec.quantity.gte(1)) {
      this.megaBuildersAck.complete();
    } else if (game.researchManager.moddersSpec.quantity.gte(1)) {
      this.moddersAck.complete();
    } else if (game.researchManager.explorersSpec.quantity.gte(1)) {
      this.explorerAck.complete();
    }
  }
  //#region Save and Load
  getSave(): any {
    return {
      k: this.achievements.map((ack) => ack.getSave())
    };
  }
  load(data: any) {
    if ("k" in data) {
      for (const aData of data.k) {
        const ack = this.achievements.find((a) => a.id === aData.i);
        if (ack) ack.load(aData);
      }
    }
    this.groups.forEach((gr) => gr.reloadNumber());
  }
  //#endregion
}
