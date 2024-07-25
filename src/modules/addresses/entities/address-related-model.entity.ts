import { AdderssModel } from './address-model.entity';
import { UserModel } from 'src/modules/users/entities';

export const AddressRelatedModel = AdderssModel.extend({
  user: UserModel,
});
