public with sharing class JestData {
    @AuraEnabled(cacheable=true)
    public static Wrapper getUserData(){
        Wrapper w = new Wrapper();
        w.userId = '02042003';
        w.message = 'List of words 1';
        System.debug(w);
        return w;
    }

    public class Wrapper{
        @AuraEnabled
        public String userId {get; set;}
        @AuraEnabled
        public String message {get; set;}
    }
}
