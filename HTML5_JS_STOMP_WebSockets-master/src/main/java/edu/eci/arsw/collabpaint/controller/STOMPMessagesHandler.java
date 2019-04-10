package edu.eci.arsw.collabpaint.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class STOMPMessagesHandler {

	
	@Autowired
	SimpMessagingTemplate msgt;
	
	ArrayList<Integer> points = new ArrayList<Integer>();
	
	@MessageMapping("newpoly.{numdibujo}")    
	public void handlePolyEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
		if(points.size()>=6) {
			System.out.println("Nuevo poligono recibido en el servidor!:"+pt);
			msgt.convertAndSend("/topic/newpoly."+numdibujo, points);
		}
	}
    
	@MessageMapping("newpoint.{numdibujo}")    
	public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
		System.out.println("Nuevo punto recibido en el servidor!:"+pt);
		points.add(pt.getX());
		points.add(pt.getY());
		msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
	}
}
