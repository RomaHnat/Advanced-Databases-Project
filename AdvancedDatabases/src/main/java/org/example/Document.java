package org.example;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)

public class Document {

    @JsonProperty("_id")
    private String _id;

    @JsonProperty("_rev")
    private String _rev;

    private int personId;
    private String gender;
    private int age;
    private String occupation;
    private double sleepDuration;
    private int qualityOfSleep;
    private int physicalActivityLevel;
    private int stessLevel;
    private String bmiCategory;
    private String bloodPressure;
    private int heartRate;
    private int dailySteps;
    private String sleepDisorder;

    public Document(String _id, int personId, String gender, int age, String occupation, double sleepDuration, int qualityOfSleep, int physicalActivityLevel, int stessLevel, String bmiCategory, String bloodPressure, int heartRate, int dailySteps, String sleepDisorder) {
        this._id = _id;
        this.personId = personId;
        this.gender = gender;
        this.age = age;
        this.occupation = occupation;
        this.sleepDuration = sleepDuration;
        this.qualityOfSleep = qualityOfSleep;
        this.physicalActivityLevel = physicalActivityLevel;
        this.stessLevel = stessLevel;
        this.bmiCategory = bmiCategory;
        this.bloodPressure = bloodPressure;
        this.heartRate = heartRate;
        this.dailySteps = dailySteps;
        this.sleepDisorder = sleepDisorder;
    }

    public Document() {

    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String get_rev() {
        return _rev;
    }

    public void set_rev(String _rev) {
        this._rev = _rev;
    }

    public int getPersonId() {
        return personId;
    }

    public void setPersonId(int personId) {
        this.personId = personId;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public double getSleepDuration() {
        return sleepDuration;
    }

    public void setSleepDuration(double sleepDuration) {
        this.sleepDuration = sleepDuration;
    }

    public int getQualityOfSleep() {
        return qualityOfSleep;
    }

    public void setQualityOfSleep(int qualityOfSleep) {
        this.qualityOfSleep = qualityOfSleep;
    }

    public int getPhysicalActivityLevel() {
        return physicalActivityLevel;
    }

    public void setPhysicalActivityLevel(int physicalActivityLevel) {
        this.physicalActivityLevel = physicalActivityLevel;
    }

    public int getStessLevel() {
        return stessLevel;
    }

    public void setStessLevel(int stessLevel) {
        this.stessLevel = stessLevel;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public int getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    public int getDailySteps() {
        return dailySteps;
    }

    public void setDailySteps(int dailySteps) {
        this.dailySteps = dailySteps;
    }

    public String getSleepDisorder() {
        return sleepDisorder;
    }

    public void setSleepDisorder(String sleepDisorder) {
        this.sleepDisorder = sleepDisorder;
    }

}
