import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";

export type RadioCardOption = {
    id: string;
    value: string;
    label: string;
};

type RadioButtonCardGroupProps = {
    options: RadioCardOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    legend: string;
    description: string;
};

const RadioButtonCardGroup = ({ options, selectedValue, onValueChange, legend, description }: RadioButtonCardGroupProps) => {
    return (
        <FieldGroup className="w-full">
            <FieldSet>
                <FieldLegend variant="label">{legend}</FieldLegend>
                <FieldDescription>{description}</FieldDescription>
                <RadioGroup
                    className="grid sm:grid-cols-2 md:grid-cols-3"
                    defaultValue=""
                    value={selectedValue}
                    onValueChange={onValueChange}
                >
                    {options.map(({ id, value, label }) => (
                        <FieldLabel
                            className="border-sidebar-primary hover:border-sidebar-primary-foreground cursor-pointer"
                            key={id}
                            htmlFor={id}
                        >
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>{label}</FieldTitle>
                                </FieldContent>
                                <RadioGroupItem
                                    className="cursor-pointer border-sidebar-primary"
                                    value={value}
                                    id={id}
                                />
                            </Field>
                        </FieldLabel>
                    ))}
                </RadioGroup>
            </FieldSet>
        </FieldGroup>
    );
};

export default RadioButtonCardGroup;