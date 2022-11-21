import * as alt from 'alt-server';
import { Vector3 } from 'alt-shared';
import { Athena } from '../../../../server/api/athena';
import { command } from '../../../../server/decorators/commands';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';

import interiors from '../defaults/interiors';

export class GpInteriors {
    static init() {}

    @command(
        'gotointerior',
        '/gotointerior [name] - Goto Interior (try /gotointerior Movie Theatre)',
        PERMISSIONS.ADMIN,
    )
    static gotoInterior(player: alt.Player, ...args: string[]) {
        const name = args.join(' ');
        const filteredInteriors = interiors.filter((interior) => interior.name.includes(name));

        if (filteredInteriors && filteredInteriors.length > 0) {
            const interior = filteredInteriors[0];

            if (interior.ipl) {
                alt.emitClient(player, SYSTEM_EVENTS.IPL_LOAD, interior.ipl);
            }

            Athena.player.set.frozen(player, true);
            Athena.player.safe.setPosition(player, interior.position.x, interior.position.y, interior.position.z);

            // Freeze Player for Interior Loading
            alt.setTimeout(() => {
                Athena.player.set.frozen(player, false);
                Athena.player.emit.message(player, `You have entered ${interior.name}`);
                Athena.player.emit.message(
                    player,
                    `Interior Position: ${interior.position.x}, ${interior.position.y}, ${interior.position.z}`,
                );
                Athena.player.emit.message(player, `Interior IPL: ${interior.ipl}`);
                Athena.player.emit.message(player, `Interior categories: ${interior.categories}`);
            }, 1000);
        } else {
            Athena.player.emit.message(player, `Interior ${name} not found!`);
        }
    }

    static getInterior(name: string) {
        const interior = interiors.filter((interior) => interior.name.includes(name));
        if (interior && interior.length > 0) {
            return interior[0];
        }
        return null;
    }

    static getInteriorPosition(name: string): Vector3 | null {
        const currentInterior = interiors.find((x) => x.name === name);
        if (currentInterior) {
            return currentInterior.position as Vector3;
        }
        return null;
    }

    static getInteriorIPL(name: string): string | null {
        const interior = interiors.filter((interior) => interior.name.includes(name));
        if (interior && interior.length > 0) {
            return interior[0].ipl;
        }
        return null;
    }

    static getInteriors() {
        return interiors;
    }

    static getInteriorsByCategory(category: string) {
        return interiors.filter((interior) => interior.categories.includes(category));
    }

    static getInteriorNames(): string[] {
        const names = interiors.map(function (item) {
            return item.name;
        });

        return names;
    }

    static getInteriorNamesByCategory(category: string): string[] {
        const filteredInteriors = interiors.filter((interior) => interior.categories.includes(category));

        const names = filteredInteriors.map(function (item) {
            return item.name;
        });

        return names;
    }
}
