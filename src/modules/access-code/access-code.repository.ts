import { InputType } from "type-graphql";
import { FindOptionsWhere, In } from "typeorm";
import { convertToDataloaderResult } from "../../utils/graphql/convert-to-dataloader-results";
import { dataLoaderFactory } from "../../utils/graphql/dataloader-factory";
import { AccessCode } from "./entities/access-code.entity";

const accessCodeLoader = dataLoaderFactory<number, AccessCode>(async (ids) => {
  const accessCodes = await AccessCode.find({
    where: { id: In(ids as number[]) },
  });
  return convertToDataloaderResult(ids, accessCodes, "id");
});
type InputType = Pick<
  AccessCode,
  "reservation_id" | "remote_passcode_id" | "passcode"
>;
const create = (input: InputType) => {
  const accessCode = AccessCode.create({ ...input });
  return accessCode.save();
};
const remove = (id: number) => AccessCode.delete({ id });
const findOneBy: (
  input: FindOptionsWhere<AccessCode>
) => Promise<AccessCode | null> = (input: FindOptionsWhere<AccessCode>) => {
  return AccessCode.findOneBy(input);
};
const findById: (id: number) => Promise<AccessCode | null> = async (
  id: number
) => {
  const data = await accessCodeLoader.load(id);
  return data;
};
const cancel: (id: number) => Promise<AccessCode | null> = async (
  id: number
) => {
  const accessCode = await AccessCode.findOneBy({ id });
  if (!accessCode) {
    return null;
  }
  Object.assign(accessCode, { is_cancelled: true });
  return accessCode.save();
};
const list = () => AccessCode.find({});

const updateBy = (
  filter: FindOptionsWhere<AccessCode>,
  input: Partial<InputType>
) => {
  return AccessCode.update(filter, input);
};

const findAndRemove = async (reservation_id: number) => {
  // we can't use Promise.all because there's a race condition between these two queries [findOneBy and Remove]
  // it can be deleted before finding it

  const accessCode = await accessCodeRepository.findOneBy({ reservation_id });
  if (!accessCode) {
    throw new Error("Access Code Not found");
  }
  await accessCodeRepository.remove(accessCode?.id);
  return accessCode;
};
export const accessCodeRepository = {
  create,
  findOneBy,
  cancel,
  remove,
  list,
  findById,
  updateBy,
  findAndRemove,
};
