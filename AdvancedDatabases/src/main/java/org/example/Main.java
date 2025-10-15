package org.example;
import  org.ektorp.*;
import  org.ektorp.http.*;
import  org.ektorp.impl.*;
import redis.clients.jedis.Jedis;

public class Main {
    public static void main(String[] args) {
        try {
            HttpClient httpClient = new StdHttpClient.Builder()
                    .url("http://localhost:5984")
                    .username("admin")
                    .password("mtu12345")
                    .build();

            CouchDbInstance dbInstance = new StdCouchDbInstance(httpClient);

            CouchDbConnector db = new StdCouchDbConnector("sleep-quality", dbInstance);
            db.createDatabaseIfNotExists();

            Jedis redis = new Jedis("localhost", 6379);

            //Uncomment functions needed
            addToDatabase(db, "p376", redis);

            readFromDatabase(db, "p376");

            //updateDocument(db, "p376", redis);

            //readFromDatabase(db, "p376");

            //deleteDocument(db, "p376", redis);

            //readFromDatabase(db, "p376");

        } catch (Exception e) {

            System.out.println("Error: " + e.getMessage());

        }
    }

    public static void addToDatabase(CouchDbConnector db, String id, Jedis redis) {

        Document document = new Document(id, 376, "Male", 60, "Doctor", 6.2, 6, 8, 8, "Normal", "120/80", 78, 9000, "None");
            document.set_rev(null);
            db.create(document);
            saveToRedis(document, redis);

    }

    public static void readFromDatabase(CouchDbConnector db, String id) {

        Document document  = db.get(Document.class, id);
        System.out.println("Occupation: " + document.getOccupation() + ", Sleep Duration: " + document.getSleepDuration() + ", Daily Steps: " + document.getDailySteps());

    }

    public static void updateDocument(CouchDbConnector db, String id) {

        Document document = db.get(Document.class, id);
        document.setSleepDuration(7.5);
        document.setDailySteps(9500);
        document.setOccupation("Unemployed");
        db.update(document);

    }

    public static void deleteDocument(CouchDbConnector db, String id, Jedis redis) {

        Document document = db.get(Document.class, id);
        db.delete(document);
        redis.del(id);

    }

    public static void saveToRedis(Document document, Jedis redis) {

            String key = document.get_id();
            String value = document.toString();

            redis.set(key,  value);
            String result = redis.get(key);
            System.out.println("Value from Redis: " + result);

    }

}