import { setTitle } from '@/utils/document';
import { useEffect, useState } from 'react';
import { resultData } from '@/mocks/result';
import { getGenderName, getTestResult, numberToRoman } from '@/utils/common.helpers';
import { Template_Result_1 } from '@/types/template.type';
import { TestResultEnum } from '@/enums/TestResultEnum';
import { Document, Page, Text, View, PDFViewer, OnRenderProps } from '@react-pdf/renderer';
import { styles } from './test-result.const';
import { Props } from './test-result.type';

const TestResult = ({ onUploadFile }: Props) => {
    const [dataSource, setDataSource] = useState<Template_Result_1 | null>();

    useEffect(() => {
        setTitle('Patient | CareBlock');
        setDataSource(JSON.parse(resultData));
    }, []);

    return (
        <PDFViewer className="w-full h-full">
            <Document
                onRender={(props: OnRenderProps) => {
                    onUploadFile(props, dataSource);
                }}
            >
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        {dataSource && (
                            <>
                                <Text style={styles.title}>{`${dataSource.general.title}`.toUpperCase()}</Text>
                                <View style={styles.table}>
                                    <View style={styles.row1}>
                                        <Text style={styles.cell}>
                                            Fullname:{' '}
                                            <Text style={styles.fontBold}>
                                                {`${dataSource.general?.fullname}`.toUpperCase()}
                                            </Text>
                                        </Text>
                                        <Text style={styles.celle}>
                                            Date of birth: {dataSource.general?.dateOfBirth}
                                        </Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell}>
                                            Order: <Text style={styles.fontBold}>{dataSource.general?.order}</Text>
                                        </Text>
                                        <Text style={styles.celle}>
                                            Gender:{' '}
                                            <Text style={styles.fontBold}>
                                                {getGenderName(dataSource.general?.gender!)}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.heading}>1. Clinical examination results</Text>
                                <View style={styles.table}>
                                    <View style={styles.row1}>
                                        <Text style={styles.cell15p}>
                                            Height(cm): {dataSource.clinicalExamination?.height}
                                        </Text>
                                        <Text style={styles.cell15p}>
                                            Weight(kg): {dataSource.clinicalExamination?.weight}
                                        </Text>
                                        <Text style={styles.cell15p}>BMI: {dataSource.clinicalExamination?.bmi}</Text>
                                        <Text style={styles.cell20p}>
                                            Circuit(Per minute): {dataSource.clinicalExamination?.circuit}
                                        </Text>
                                        <Text style={styles.cell35p}>
                                            Blood pressure(mmHg): {dataSource.clinicalExamination?.bloodPressure}
                                        </Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>Generality</Text>
                                        <Text style={styles.cellGrowe}>
                                            {dataSource.clinicalExamination?.generality}
                                        </Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>Vision</Text>
                                        <Text style={styles.cell17d5}>Right eye</Text>
                                        <Text
                                            style={styles.cell20p}
                                        >{`${dataSource.clinicalExamination?.vision?.right?.new}/10. Old glasses ${dataSource.clinicalExamination?.vision?.right?.old}/10`}</Text>
                                        <Text style={styles.cell17d5}>Left eye</Text>
                                        <Text
                                            style={styles.cell20pe}
                                        >{`${dataSource.clinicalExamination?.vision?.left?.new}/10. Old glasses ${dataSource.clinicalExamination?.vision?.left?.old}/10`}</Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>Eyes</Text>
                                        <Text style={styles.cellGrowe}>{dataSource.clinicalExamination?.eyes}</Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>Examination - Endoscopy TMH</Text>
                                        <Text style={styles.cellGrowe}>{dataSource.clinicalExamination?.tmh}</Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>Dentomaxillofacial</Text>
                                        <Text style={styles.cellGrowe}>
                                            {dataSource.clinicalExamination?.dentomaxillofacial}
                                        </Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>Dermatology</Text>
                                        <Text style={styles.cellGrowe}>
                                            {dataSource.clinicalExamination?.dermatology}
                                        </Text>
                                    </View>
                                    <View style={styles.row2}>
                                        <Text style={styles.cell25p}>ObstetricExamination</Text>
                                        <Text style={styles.cellGrowe}>
                                            {dataSource.clinicalExamination?.obstetricExamination}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.heading}>2. Paraclinical results</Text>
                                <View style={styles.table}>
                                    <View>
                                        <View style={styles.row1}>
                                            <Text style={styles.cell30p}>Test name</Text>
                                            <Text style={styles.cell10p}>Result</Text>
                                            <Text style={styles.cell50p}>Test name</Text>
                                            <Text style={styles.cell10pe}>Result</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.row2}>
                                            <View style={styles.col1}>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cellGrow}>Glucose (3.9-5.6mmol/L)</Text>
                                                    <Text style={styles.cell25p}>
                                                        {dataSource.paraclinicalResults?.test?.glucose}
                                                    </Text>
                                                </View>
                                                <View style={styles.row3e}>
                                                    <Text style={styles.cell22ph}>Kidney</Text>
                                                    <View style={styles.col3}>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrow}>Ure(2.5-7.5mmol/L)</Text>
                                                            <Text style={styles.cell31d5p}>
                                                                {dataSource.paraclinicalResults?.test?.kidney?.ure}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>Creatinin(50-98umol/L)</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {
                                                                    dataSource.paraclinicalResults?.test?.kidney
                                                                        ?.creatinin
                                                                }
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.row3e}>
                                                    <Text style={styles.cellGrow}>Acid uric(150-420umol/L)</Text>
                                                    <Text style={styles.cell25p}>
                                                        {dataSource.paraclinicalResults?.test?.acidUric}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.cell20ph}>Peripheral blood cells</Text>
                                            <View style={styles.col1}>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cellGrow}>White blood(3.5-10.5G/L)</Text>
                                                    <Text style={styles.cell25pe}>
                                                        {
                                                            dataSource.paraclinicalResults?.test?.peripheralBloodCells
                                                                ?.whiteBloodCells
                                                        }
                                                    </Text>
                                                </View>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cellGrowt}>Red blood(3.8-5.5T/L)</Text>
                                                    <Text style={styles.cell25pt}>
                                                        {
                                                            dataSource.paraclinicalResults?.test?.peripheralBloodCells
                                                                ?.redBloodCells
                                                        }
                                                    </Text>
                                                </View>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cellGrowt}>HST(120-160G/L)</Text>
                                                    <Text style={styles.cell25pt}>
                                                        {
                                                            dataSource.paraclinicalResults?.test?.peripheralBloodCells
                                                                ?.hst
                                                        }
                                                    </Text>
                                                </View>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cellGrowt}>Platelet(150-450G/L)</Text>
                                                    <Text style={styles.cell25pt}>
                                                        {
                                                            dataSource.paraclinicalResults?.test?.peripheralBloodCells
                                                                ?.platelet
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row2}>
                                            <View style={styles.col1}>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cell22ph2}>Liver</Text>
                                                    <View style={styles.col3}>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrow}>AST(5.0-34U/L)</Text>
                                                            <Text style={styles.cell31d5p}>
                                                                {dataSource.paraclinicalResults?.test?.liver?.ast}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>ALT(9-36U/L)</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {dataSource.paraclinicalResults?.test?.liver?.alt}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>GGT(0-55U/L)</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {dataSource.paraclinicalResults?.test?.liver?.ggt}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cell24pht3}>Cholesterol</Text>
                                                    <View style={styles.col3}>
                                                        <View style={styles.row4}>
                                                            <Text
                                                                style={styles.cellGrowt}
                                                            >{`Triglycerid(<1.7mmol/L)`}</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {
                                                                    dataSource.paraclinicalResults?.test?.cholesterol
                                                                        .triglycerid
                                                                }
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text
                                                                style={styles.cellGrowt}
                                                            >{`Cholesterol(<5.2mmol/L)`}</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {
                                                                    dataSource.paraclinicalResults?.test?.cholesterol
                                                                        .cholesterol
                                                                }
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>HDL - C(0.9-2.0mm/L)</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {dataSource.paraclinicalResults?.test?.cholesterol.hdl}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>LDL - C(0.5-3.4mm/L)</Text>
                                                            <Text style={styles.cell31d5pt}>
                                                                {dataSource.paraclinicalResults?.test?.cholesterol.ldl}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cellGrowt}>CA 72-4 (Male)</Text>
                                                    <Text style={styles.cell25pte}>
                                                        {dataSource.paraclinicalResults?.test?.ca724}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.col5}>
                                                <View style={styles.row4}>
                                                    <Text style={styles.cell33ph}>Urine</Text>
                                                    <View style={styles.col3}>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrow}>
                                                                Glucoso: {TestResultEnum.Negative}
                                                            </Text>
                                                            <Text style={styles.cell25pe}>
                                                                {getTestResult(
                                                                    dataSource.paraclinicalResults?.test?.urine
                                                                        ?.glucose!
                                                                )}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>
                                                                Red blood: {TestResultEnum.Negative}
                                                            </Text>
                                                            <Text style={styles.cell25pt}>
                                                                {getTestResult(
                                                                    dataSource.paraclinicalResults?.test?.urine
                                                                        ?.redBloodCells!
                                                                )}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>
                                                                Protein: {TestResultEnum.Negative}
                                                            </Text>
                                                            <Text style={styles.cell25pt}>
                                                                {getTestResult(
                                                                    dataSource.paraclinicalResults?.test?.urine
                                                                        ?.protein!
                                                                )}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.row4}>
                                                            <Text style={styles.cellGrowt}>
                                                                White blood: {TestResultEnum.Negative}
                                                            </Text>
                                                            <Text style={styles.cell25pt}>
                                                                {getTestResult(
                                                                    dataSource.paraclinicalResults?.test?.urine
                                                                        ?.whiteBloodCells!
                                                                )}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.col3}>
                                                    <View style={styles.row4}>
                                                        <Text style={styles.cellGrowt}>CEA quantification</Text>
                                                        <Text style={styles.cell17pt}>
                                                            {dataSource.paraclinicalResults?.test?.cea}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.row4}>
                                                        <Text style={styles.cellGrowt}>
                                                            AFP quantification(0-5.81U/ml)
                                                        </Text>
                                                        <Text style={styles.cell17pt}>
                                                            {dataSource.paraclinicalResults?.test?.afp}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.row4}>
                                                        <Text style={styles.cellGrowt}>
                                                            CA 125 quantification(0-35U/ml) (Female)
                                                        </Text>
                                                        <Text style={styles.cell17pt}>
                                                            {dataSource.paraclinicalResults?.test?.ca125 || ''}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.row4}>
                                                        <Text style={styles.cellGrow}></Text>
                                                        <Text style={styles.cell17pe}></Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.col3}>
                                            <View style={styles.row1e}>
                                                <Text style={styles.cell25p}>Chest X-Ray (T)</Text>
                                                <Text style={styles.cellGrowe}>
                                                    {dataSource.paraclinicalResults?.xQuang}
                                                </Text>
                                            </View>
                                            <View style={styles.row1e}>
                                                <Text style={styles.cell25p}>General abdominal ultrasound</Text>
                                                <Text style={styles.cellGrowe}>
                                                    {dataSource.paraclinicalResults?.abdominalUltrasound}
                                                </Text>
                                            </View>
                                            <View style={styles.row1e}>
                                                <Text style={styles.cell25p}>Breast ultrasound (Female)</Text>
                                                <Text style={styles.cellGrowe}>
                                                    {dataSource.paraclinicalResults?.mammaryGland}
                                                </Text>
                                            </View>
                                            <View style={styles.row1e}>
                                                <Text style={styles.cell25p}>Thyroid ultrasound</Text>
                                                <Text style={styles.cellGrowe}>
                                                    {dataSource.paraclinicalResults?.thyroid}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Text
                                    style={styles.heading}
                                >{`3. Pathology requires consultation and treatment: ${dataSource.note}`}</Text>
                                <Text
                                    style={styles.heading}
                                >{`4. Health classification: ${numberToRoman(dataSource.healthClassification!)}`}</Text>
                                <View>
                                    <Text style={styles.textRightItalic}>{`${dataSource.general?.createdDate}`}</Text>
                                    <Text style={styles.textRightBold}>
                                        {`${dataSource.general?.hospital}`.toUpperCase()}
                                    </Text>
                                    <Text style={styles.textRight}>{`${dataSource.general?.sign}`}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default TestResult;
