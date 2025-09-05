import mongoose, {Schema, Document} from "mongoose";

export interface ITest extends Document{
    name: string;
}

const TestSchema: Schema = new Schema({
    name: {
        type: String,
        require: true
    },
});

export default mongoose.model<ITest>("Test", TestSchema);