import { Ability, AbilityBuilder } from '@casl/ability';
import configureStore from "@app/redux/configureStore";

// Defines how to detect object's type
function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }
  // eslint-disable-next-line no-underscore-dangle
  return item.__type;
}

const ability = new Ability([], { subjectName });

function defineRulesFor(permission) {
  const { can, rules } = AbilityBuilder?.extract();

  if (permission === "admin") {
    can("edit", "functions");
  }

  if (permission === "admin" || permission === "viewer") {
    can("view", "functions");
  }

  if (permission === "viewer") {
    can("guess", "functions");
  }

  return rules;
}

let currentRole = {}
configureStore.subscribe(async () => {
  const prevRole = {currentRole}
  currentRole = configureStore?.getState()?.global?.user?.role?.title

  if (currentRole) {
    ability.update(defineRulesFor(currentRole));
  }
});

export function runFunction(cb = {}) {
  if (ability.can('edit', "functions")) {
    cb()
  }
}

export default ability;
