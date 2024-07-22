import { AdderssModel } from 'src/modules/addresses/entities/address-model.entity';
import { UserModel } from './user-model.entity';

export const UserRelatedModel = UserModel.extend({
  addresses: AdderssModel,
});
