"use server"
import { Teachers } from "@/firestore/documents/teacher";
import { Parents } from "@/firestore/documents/parent";
import { Students } from "@/firestore/documents/student";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import QRCode from "qrcode";

export const acceptFileDataToUpload = async (fileData, source, schoolID, userID) => {
    let retval
    let dataToInsert
    let dataToInsertWithStdDiv
    if (source === 'teachers') {
        dataToInsert = fileData?.map((data) => ({...data, cloudinaryImageId: 'NA', createdDate: new Date().toLocaleDateString("en-IN"), createdBy: userID, updatedDate: 'NA', updatedBy: 'NA', schoolID: schoolID, teacherID: 'new'}))
        dataToInsert.forEach(async (element) => {
            let newTeacher = new Teachers(
                element.teacherName,
                element.email,
                element.password,
                element.sceretQts,
                element.sceretAns,
                element.qualification,
                element.urlDP,
                element.cloudinaryImageId,
                element.createdDate,
                element.createdBy,
                element.updatedDate,
                element.updatedBy,
                element.schoolID
            );
            retval = await newTeacher.addTeacher();
            newTeacher = {}
        });

        return {returnSource: source, recordInserted: dataToInsert.length}

    } else if (source === 'parents') {
        dataToInsert = fileData?.map((data) => ({...data, cloudinaryImageId: 'NA', createdDate: new Date().toLocaleDateString("en-IN"), createdBy: userID, updatedDate: 'NA', updatedBy: 'NA', schoolID: schoolID, parentID: 'new'}))
        dataToInsert.forEach(async (element) => {
            let newParent = new Parents(
                element.parentName,
                element.qualification,
                element.email,
                element.password,
                element.sceretQts,
                element.sceretAns,
                element.noOfChildren,
                element.address,
                element.contact,
                element.urlDP,
                element.cloudinaryImageId,
                element.createdDate,
                element.createdBy,
                element.updatedDate,
                element.updatedBy,
                element.schoolID
            );
            retval = await newParent.addParent();
            newParent = null
        });

        return {returnSource: source, recordInserted: dataToInsert.length}
    } else if(source === 'students') {
        dataToInsert = fileData?.map((data) => ({...data, cloudinaryImageId: 'NA', createdDate: new Date().toLocaleDateString("en-IN"), createdBy: userID, updatedDate: 'NA', updatedBy: 'NA', schoolID: schoolID, studentID: 'new'}))
        if (dataToInsert?.length > 0) {
            const stdResult = await Standards.getStandardsBySchool(schoolID);
            const divResult = await Divisions.getDivisionsBySchool(schoolID);

            const standardMap = stdResult.reduce((acc, std) => {
                acc[std.stdName] = std.stdID;
                return acc;
            }, {});

            const divisionMap = divResult.reduce((acc, div) => {
                acc[div.divName] = div.divID;
                return acc;
            }, {});

            dataToInsertWithStdDiv = dataToInsert.map((student) => ({
                ...student,
                stdID: standardMap[student.stdName] || "Unknown",
                divID: divisionMap[student.divName] || "Unknown",
            }));

            dataToInsertWithStdDiv.forEach(async (element) => {
                let newStudent = new Students(
                    element.schoolID,
                    element.studentName,
                    element.stdID,
                    element.divID,
                    element.email,
                    element.grNo,
                    element.academicYear,
                    element.urlDP,
                    "NA",
                    element.cloudinaryImageId,
                    element.createdDate,
                    element.createdBy,
                    element.updatedDate,
                    element.updatedBy,
                );
                retval = await newStudent.addStudent();
                newStudent = null
            });

            const studentResult = await Students.getStudentsBySchool(schoolID);

            studentResult.forEach(async (student) => {
                //generate urlQR 
                let finalUrlQR = await QRCode.toDataURL(JSON.stringify({
                    schoolID: student.schoolID,
                    studentName: student.studentName,
                    studentID: student.studentID,
                    academicYear: student.academicYear,
                    stdID: student.stdID,
                    divID: student.divID,
                    grNO: student.grNO
                }));

                let existsingStudent = new Students(
                    student.schoolID,
                    student.studentName,
                    student.stdID,
                    student.divID,
                    student.email,
                    student.grNo,
                    student.academicYear,
                    student.urlDP,
                    finalUrlQR,
                    student.cloudinaryImageId,
                    student.createdDate,
                    student.createdBy,
                    student.updatedDate,
                    student.updatedBy,
                    student.studentID
                );
                retval = await existsingStudent.updateStudent();
                finalUrlQR = null
                existsingStudent = null
            });
        } 

        return {returnSource: source, recordInserted: dataToInsert.length}

    } else {
        return {returnSource: source, recordInserted: -1}
    }
}