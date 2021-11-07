import {Constraint} from 'matter-js';

declare module "matter-js" {
    interface MouseConstraint extends Constraint {
    }
}